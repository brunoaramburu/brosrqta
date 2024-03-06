from django.contrib import admin
from django import forms
from .models import Categoria, Grupo, Producto, Tamaño, CarritoCheckout, FotoTalle, Color, ProductoColorTamaño, ImagenesProducto, Orden, Aviso, Envio
from prettyjson import PrettyJSONWidget

admin.site.register(Categoria)
admin.site.register(Grupo)
admin.site.register(Producto)
admin.site.register(Tamaño)
admin.site.register(CarritoCheckout)
admin.site.register(FotoTalle)
admin.site.register(Color)
admin.site.register(ProductoColorTamaño)
admin.site.register(ImagenesProducto)
admin.site.register(Aviso)
admin.site.register(Envio)

class OrdenForm(forms.ModelForm):
    class Meta:
        model = Orden
        fields = '__all__'
        widgets = {
            'datoscliente': PrettyJSONWidget(),
            'productos': PrettyJSONWidget(),
        }

class OrdenAdmin(admin.ModelAdmin):
    form = OrdenForm

admin.site.register(Orden, OrdenAdmin)

