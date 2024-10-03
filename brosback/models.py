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
    class Meta:
        verbose_name = "Configuracion de color"
        verbose_name_plural = "Configuracion de colores"
    
class FotoTalle(models.Model):
    nombre = models.CharField(max_length=50)
    img = models.ImageField(upload_to='talles/', null=True, blank=True)
    # You can add other relevant fields for colors, such as hex code, RGB values, etc.

    def __str__(self):
        return self.nombre
    class Meta:
        verbose_name = "Guia de talle"
        verbose_name_plural = "Guias de talle"

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
    class Meta:
        verbose_name = "Configuracion de imagenes de productos por color"
        verbose_name_plural = "Configuracion de imagenes de productos por color"

class Tamaño(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=10)
    # Otros campos relevantes para tus necesidades específicas

    def __str__(self):
        return self.nombre
    class Meta:
        verbose_name = "Tamaño"
        verbose_name_plural = "Tamaños"

class ProductoColorTamaño(models.Model):
    id = models.AutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.CASCADE)
    tamaño = models.ForeignKey(Tamaño, on_delete=models.CASCADE)
    stock = models.IntegerField()
    # Otros campos relevantes para la relación entre producto y tamaño

    def __str__(self):
        return f"{self.producto} - {self.color} - {self.tamaño} - STOCK: {self.stock}"
    class Meta:
        verbose_name = "Configuración de productos por color, tamaño y stock"
        verbose_name_plural = "Configuraciónes de productos por color, tamaño y stock"

class CarritoCheckout(models.Model):
    id = models.AutoField(primary_key=True)
    detalle = models.CharField(max_length=5000)
    checkout_datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.checkout_datetime
    class Meta:
        verbose_name = "Carrito generado"
        verbose_name_plural = "Carritos generados"

class Cupon(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=200)
    descuento =  models.IntegerField()
    validohasta = models.DateField()    

    def __str__(self):
        return self.codigo
    class Meta:
        verbose_name = "Cupón de descuento"
        verbose_name_plural = "Cupónes de descuento"

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
    cupon = models.ForeignKey(Cupon, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Orden {self.id} - {self.estado} - {self.medio}"
    class Meta:
        verbose_name = "Orden de compra"
        verbose_name_plural = "Ordenes de compra"
    
class Envio(models.Model):
    aDomicilio = models.IntegerField(primary_key=True)
    aSucursal = models.IntegerField()

    def __str__(self):
        return f"Precio a domicilio ${self.aDomicilio} - Precio a sucursal ${self.aSucursal}"
    class Meta:
        verbose_name = "Configuración de precios de envío"
        verbose_name_plural = "Configuración de precios de envío"
    
class EnvioGratis(models.Model):
    id = models.AutoField(primary_key=True) 
    activo = models.BooleanField()
    compraminima = models.IntegerField()

    def __str__(self):
        if self.activo:
            return f"Envio gratis - Activado - Compra minima: ${self.compraminima}"
        else:
            return f"Envio gratis - Desactivado - Compra minima: ${self.compraminima}"
    class Meta:
        verbose_name = "Configuración de envío gratis"
        verbose_name_plural = "Configuración de envío gratis"
    
class DescuentoTransferencia(models.Model):
    activo = models.BooleanField(primary_key=True)
    porcentaje = models.IntegerField()
    
    def __str__(self):
        if self.activo:
            return f"Activado - Porcentaje: {self.porcentaje}%"
        else:
            return f"Desactivado - Porcentaje: {self.porcentaje}%"
    class Meta:
        verbose_name = "Configuración de descuento por transferencia"
        verbose_name_plural = "Configuración de descuento por transferencia"
    
class Aviso(models.Model):
    id = models.AutoField(primary_key=True)
    aviso = models.CharField(max_length=200) 

    def __str__(self):
        return self.aviso

class InhabilitarWeb(models.Model):
    id = models.AutoField(primary_key=True) 
    inhabilitar = models.BooleanField(default=False)

    def __str__(self):
        if self.inhabilitar:
            return f"Estado: Web inhabilitada"
        else:
            return f"Estado: Web activa"
    class Meta:
        verbose_name = "Inhabilitar web"
        verbose_name_plural = "Inhabilitar web"

class CodigoAcceso(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=200) 

    def __str__(self):
        return self.codigo
    class Meta:
        verbose_name = "Codigo de acceso"
        verbose_name_plural = "Codigos de acceso"



