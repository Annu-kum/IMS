from import_export import resources
from .models import MillersEntrymodel



class MillersEntrymodelResource(resources.ModelResource):
    class Meta:
        model=MillersEntrymodel
        skip_unchanged = True
        report_skipped = True
        import_id_fields=['MILLER_TRANSPORTER_ID']
        fields=('MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'MA_Code', 'district')