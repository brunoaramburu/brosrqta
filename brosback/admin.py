from django.contrib import admin
from django import forms
from .models import Categoria, Grupo, Producto, CodigoAcceso , Tamaño, CarritoCheckout, Cupon, InhabilitarWeb ,FotoTalle, Color, ProductoColorTamaño, ImagenesProducto, Orden, Aviso, Envio, EnvioGratis, DescuentoTransferencia
from prettyjson import PrettyJSONWidget

admin.site.register(Categoria)
admin.site.register(Grupo)
admin.site.register(Producto)
admin.site.register(Tamaño)
admin.site.register(FotoTalle)
admin.site.register(Color)
admin.site.register(CodigoAcceso)
admin.site.register(Aviso)
admin.site.register(Envio)
admin.site.register(Cupon)
admin.site.register(DescuentoTransferencia)
admin.site.register(EnvioGratis)
admin.site.register(InhabilitarWeb)

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
    list_display = ('id', 'fecha', 'estado', 'medio', 'medioenvio')  # Mostrar estas columnas en la lista del admin
    ordering = ('-fecha',)  # Ordenar por fecha
    list_filter = ('estado', 'medio', 'medioenvio')  # Filtrar por estado

    def medioenvio_display(self, obj):
        return obj.medioenvio
    medioenvio_display.short_description = 'Medio de envío'

admin.site.register(Orden, OrdenAdmin)

class ProductoColorTamañoAdmin(admin.ModelAdmin):
    list_display = ('producto', 'color', 'tamaño', 'stock')  # Mostrar estas columnas en la lista del admin
    ordering = ('color', 'tamaño', 'stock')  # Ordenar por color, luego por tamaño y finalmente por stock
    list_filter = ('producto',)  # Filtrar por estado


admin.site.register(ProductoColorTamaño, ProductoColorTamañoAdmin)

class ImagenesProductoAdmin(admin.ModelAdmin):
    list_display = ('producto', 'color')  # Mostrar estas columnas en la lista del admin
    list_filter = ('producto',)  # Filtrar por producto

admin.site.register(ImagenesProducto, ImagenesProductoAdmin)


    


