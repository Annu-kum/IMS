from django.contrib import admin
from Dealer.models import Dealersmodel
# Register your models here.

@admin.register(Dealersmodel)
class DealerAdmin(admin.ModelAdmin):
    list_display=('id','Dealer_Name','contactno1','contactno2','companyName','Remark')
    search_fields=('id','Dealer_Name','contactno1','contactno2','companyName')
    list_per_page=100
    list_max_show_all = 200
    