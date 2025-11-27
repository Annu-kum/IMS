from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta, date

from Installation.models import InstallatonModels
from Deactivation.models import DeactivationModels
from Reactivation.models import ReactivationModels
from account.utility import SessionYearMixin

from django.db.models import Q


class DashboardSummaryView(SessionYearMixin, generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    # required for SessionYearMixin to work
    queryset = InstallatonModels.objects.all()

    def filter_by_session(self, model):
        self.queryset = model.objects.all()
        return super().get_queryset()

    def get_stats(self, model, date_field):
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)
        tomorrow = today + timedelta(days=1)

        qs = self.filter_by_session(model)

        return {
            "total": qs.count(),
            "new": qs.filter(NewRenewal='New').count(),
            "renewal": qs.filter(NewRenewal='Renewal').count(),

            "today_total": qs.filter(**{
                f"{date_field}__gte": today,
                f"{date_field}__lt": tomorrow
            }).count(),

            "today_new": qs.filter(**{
                f"{date_field}__gte": today,
                f"{date_field}__lt": tomorrow,
                "NewRenewal": "New"
            }).count(),

            "today_renewal": qs.filter(**{
                f"{date_field}__gte": today,
                f"{date_field}__lt": tomorrow,
                "NewRenewal": "Renewal"
            }).count(),

            "yesterday_total": qs.filter(**{
                f"{date_field}": yesterday
            }).count(),

            "yesterday_new": qs.filter(**{
                f"{date_field}": yesterday,
                "NewRenewal": "New"
            }).count(),

            "yesterday_renewal": qs.filter(**{
                f"{date_field}": yesterday,
                "NewRenewal": "Renewal"
            }).count(),
        }

    def get_otr_stats(self):
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)

        install = self.filter_by_session(InstallatonModels)
        deactivate = self.filter_by_session(DeactivationModels)
        reactivate = self.filter_by_session(ReactivationModels)

        def total(qs): return qs.filter(~Q(OTR='')).count()
        def new(qs): return qs.filter(~Q(OTR=''), NewRenewal='New').count()
        def renewal(qs): return qs.filter(~Q(OTR=''), NewRenewal='Renewal').count()

        def day_total(qs, f, d): return qs.filter(~Q(OTR=''), **{f: d}).count()
        def day_new(qs, f, d): return qs.filter(~Q(OTR=''), **{f: d}, NewRenewal='New').count()
        def day_renewal(qs, f, d): return qs.filter(~Q(OTR=''), **{f: d}, NewRenewal='Renewal').count()

        return {
            "total": total(install) + total(deactivate) + total(reactivate),
            "new": new(install) + new(deactivate) + new(reactivate),
            "renewal": renewal(install) + renewal(deactivate) + renewal(reactivate),

            "today_total": day_total(install, "InstallationDate", today) +
                           day_total(deactivate, "DeactivationDate", today) +
                           day_total(reactivate, "ReactivationDate", today),

            "today_new": day_new(install, "InstallationDate", today) +
                         day_new(deactivate, "DeactivationDate", today) +
                         day_new(reactivate, "ReactivationDate", today),

            "today_renewal": day_renewal(install, "InstallationDate", today) +
                             day_renewal(deactivate, "DeactivationDate", today) +
                             day_renewal(reactivate, "ReactivationDate", today),

            "yesterday_total": day_total(install, "InstallationDate", yesterday) +
                               day_total(deactivate, "DeactivationDate", yesterday) +
                               day_total(reactivate, "ReactivationDate", yesterday),

            "yesterday_new": day_new(install, "InstallationDate", yesterday) +
                             day_new(deactivate, "DeactivationDate", yesterday) +
                             day_new(reactivate, "ReactivationDate", yesterday),

            "yesterday_renewal": day_renewal(install, "InstallationDate", yesterday) +
                                 day_renewal(deactivate, "DeactivationDate", yesterday) +
                                 day_renewal(reactivate, "ReactivationDate", yesterday),
        }

    def get(self, request):
        return Response({
            "installation": self.get_stats(InstallatonModels, "InstallationDate"),
            "deactivation": self.get_stats(DeactivationModels, "DeactivationDate"),
            "reactivation": self.get_stats(ReactivationModels, "ReactivationDate"),
            "otr": self.get_otr_stats(),
        })