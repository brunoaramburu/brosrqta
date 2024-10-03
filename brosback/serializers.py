from rest_framework import serializers
from .models import Producto, Categoria, Orden, Envio, Aviso, EnvioGratis, DescuentoTransferencia, Cupon

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class OrdenSerializer(serializers.ModelSerializer):
    cupon = serializers.PrimaryKeyRelatedField(queryset=Cupon.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Orden
        fields = ['id', 'datoscliente', 'productos', 'fecha', 'estado', 'medio', 'preciototal', 'precioenvio', 'precioproductos', 'idtransferencia', 'medioenvio', 'cupon']

class EnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Envio
        fields = '__all__'

class EnvioGratisSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvioGratis
        fields = '__all__'

class DescuentoTransferenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DescuentoTransferencia
        fields = '__all__'
    
class AvisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aviso
        fields = '__all__'