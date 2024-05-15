from django.db import models
from django.utils import timezone
from colorfield.fields import ColorField

class Categoria(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    img = models.ImageField(upload_to='categorias/', null=True, blank=True)
    # Otros campos relevantes para la categoría

    def __str__(self):
        return self.nombre

class Grupo(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    # Otros campos relevantes para el grupo

    def __str__(self):
        return self.nombre

class Color(models.Model):
    nombre = models.CharField(max_length=50)
    rgb_value = ColorField(default='#FF0000')
    # You can add other relevant fields for colors, such as hex code, RGB values, etc.

    def __str__(self):
        return self.nombre
    
class FotoTalle(models.Model):
    nombre = models.CharField(max_length=50)
    img = models.ImageField(upload_to='talles/', null=True, blank=True)
    # You can add other relevant fields for colors, such as hex code, RGB values, etc.

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio = models.IntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True)
    fototalle = models.ForeignKey(FotoTalle, on_delete=models.SET_NULL, null=True, blank=True)
    img = models.ImageField(upload_to='productos/', null=True, blank=True)
    destacado = models.BooleanField()

    def __str__(self):
        return self.nombre
    
class ImagenesProducto(models.Model):
    id = models.AutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    img = models.ImageField(upload_to='imagenesproductos/', null=True, blank=True)
    color = models.ForeignKey(Color, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.producto} - {self.color}"

class Tamaño(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=10)
    # Otros campos relevantes para tus necesidades específicas

    def __str__(self):
        return self.nombre

class ProductoColorTamaño(models.Model):
    id = models.AutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.CASCADE)
    tamaño = models.ForeignKey(Tamaño, on_delete=models.CASCADE)
    stock = models.IntegerField()
    # Otros campos relevantes para la relación entre producto y tamaño

    def __str__(self):
        return f"{self.producto} - {self.tamaño}"

class CarritoCheckout(models.Model):
    id = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=5000)
    checkout_datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.checkout_datetime

class Orden(models.Model):
    ESTADO_CHOICES = [
        ('cancelada', 'Cancelada'),
        ('pendiente', 'Pendiente'),
        ('procesada', 'Procesada'),
        ('realizada', 'Realizada'),
    ]

    MEDIO_CHOICES = [
        ('transferencia', 'Transferencia'),
        ('uala', 'Uala')
    ]

    id = models.AutoField(primary_key=True)
    datoscliente = models.JSONField()
    productos = models.JSONField()
    fecha = models.DateTimeField(default=timezone.now)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    medio = models.CharField(max_length=25, choices=MEDIO_CHOICES)
    precioproductos = models.CharField(max_length=50)
    precioenvio = models.CharField(max_length=50)
    preciototal = models.CharField(max_length=50)
    medioenvio = models.CharField(max_length=100)
    idtransferencia = models.CharField(max_length=100, default=None)

    def __str__(self):
        return f"Orden {self.id} - {self.estado} - {self.medio}"
    
class Envio(models.Model):
    aDomicilio = models.IntegerField(primary_key=True)
    aSucursal = models.IntegerField()

    def __str__(self):
        return f"A domicilio ${self.aDomicilio} - A sucursal ${self.aSucursal}"

class EnvioGratis(models.Model):
    activo = models.BooleanField(primary_key=True)
    compraminima = models.IntegerField()

    def __str__(self):
        return f"Envio gratis activo: {self.activo} - Compra minima: ${self.compraminima}"
    
class EnvioGratis(models.Model):
    activo = models.BooleanField(primary_key=True)
    compraminima = models.IntegerField()

    def __str__(self):
        return f"Envio gratis activo: {self.activo} - Compra minima: ${self.compraminima}"
    
class DescuentoTransferencia(models.Model):
    activo = models.BooleanField(primary_key=True)
    porcentaje = models.IntegerField()

    def __str__(self):
        return f"Descuento transferencia activo: {self.activo} - Porcentaje: ${self.porcentaje}"
    
class Aviso(models.Model):
    id = models.AutoField(primary_key=True)
    aviso = models.CharField(max_length=200) 

    def __str__(self):
        return self.aviso