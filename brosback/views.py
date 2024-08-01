from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import mercadopago
import json
from rest_framework import generics
from .models import Producto, ProductoColorTamaño, Tamaño, CarritoCheckout, Grupo, Categoria, FotoTalle, ImagenesProducto, Orden, Envio, Aviso, EnvioGratis, DescuentoTransferencia
from .serializers import ProductoSerializer, CategoriaSerializer, OrdenSerializer, EnvioSerializer, AvisoSerializer, EnvioGratisSerializer, DescuentoTransferenciaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from django.template.loader import render_to_string

sdk = mercadopago.SDK("APP_USR-7175554635488661-060808-916c187ef1eae6a6bf86f08d9e936479-173724544")

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def create_preference(request):
    order_data = json.loads(request.body)

    # Extract carrito and customerData from order_data
    carrito = order_data.get("carrito", [])
    customer_data = order_data.get("customerData", {})

    preference_items = []

    for item in carrito:
        preference_item = {
            "title": item.get("description"),
            "quantity": int(item.get("quantity")),
            "unit_price": float("1"),
        }
        preference_items.append(preference_item)

    # Update payer information with customerData
    payer = {
        "name": customer_data.get("name"),
        "surname": customer_data.get("surname"),
        "email": customer_data.get("email"),
        "phone": {
            "area_code": customer_data.get("phone", {}).get("area_code"),
            "number": customer_data.get("phone", {}).get("number"),
        },
        "identification": {
            "type": customer_data.get("identification", {}).get("type"),
            "number": customer_data.get("identification", {}).get("number"),
        },
        "address": {
            "street_name": customer_data.get("address", {}).get("street_name"),
            "street_number": customer_data.get("address", {}).get("street_number"),
            "zip_code": customer_data.get("address", {}).get("zip_code"),
        },
    }

    preference_data = {
        "items": preference_items,
        "payer": {
            "name": "Juan",
            "surname": "Lopez",
            "email": "user@email.com",
            "phone": {
                "area_code": "11",
                "number": "4444-4444"
            },
            "identification": {
                "type": "DNI",
                "number": "12345678"
            },
            "address": {
                "street_name": "Street",
                "street_number": 123,
                "zip_code": "5700"
            }
        },
        "back_urls": {
            "success": "https://www.success.com",
            "failure": "https://www.failure.com",
            "pending": "https://www.pending.com",
        },
    }

    # Create CarritoCheckout instance
    print(preference_data)
    detalle = json.dumps(carrito)  # Convert carrito to JSON string
    carrito_checkout = CarritoCheckout(detalle=detalle)
    carrito_checkout.save()

    # Create Mercado Pago preference
    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]

    return JsonResponse({"id": preference["id"]})

def index(request):
    return render(request, "index.html")

class ProductoCreateAPIView(generics.CreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class ProductoListView(APIView):
    def get(self, request):
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)
    
class AvisoListView(APIView):
    def get(self, request):
        avisos = Aviso.objects.all()
        serializer = AvisoSerializer(avisos, many=True)
        return Response(serializer.data)

class EnvioListView(APIView):
    def get(self, request):
        envio = Envio.objects.all()
        serializer = EnvioSerializer(envio, many=True)
        return Response(serializer.data)
    
class EnvioGratisListView(APIView):
    def get(self, request):
        enviogratis = EnvioGratis.objects.all()
        serializer = EnvioGratisSerializer(enviogratis, many=True)
        return Response(serializer.data)
    
class DescuentoTransferenciaListView(APIView):
    def get(self, request):
        descuentotransferencia = DescuentoTransferencia.objects.all()
        serializer = DescuentoTransferenciaSerializer(descuentotransferencia, many=True)
        return Response(serializer.data)
    
class CategoriaListView(APIView):
    def get(self, request):
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data)

class ProductoDetailView(APIView):
    def get(self, request, pk):
        producto = Producto.objects.get(pk=pk)
        serializer = ProductoSerializer(producto)
        return Response(serializer.data)
    
    
def TamanoNombreView(request, tamano_id):
    try:
        tamano = Tamaño.objects.get(id=tamano_id)
        return JsonResponse({'nombre': tamano.nombre})
    except Tamaño.DoesNotExist:
        return JsonResponse({'error': 'Tamaño not found'}, status=404)
    
def FotoTalleView(request, foto_talle_id):
    try:
        foto_talle = FotoTalle.objects.get(id=foto_talle_id)
        img_relative_path = str(foto_talle.img)

        return JsonResponse({'img': img_relative_path})
    except FotoTalle.DoesNotExist:
        return JsonResponse({'error': 'Foto talle not found'}, status=404)
    
def ProductsByCategoryView(request):
    # Get the 'category_id' parameter from the query string
    category_id = request.GET.get('categoria')

    try:
        # Retrieve the category object based on the 'category_id'
        category = Categoria.objects.get(id=category_id)

        # Filter products by the specified category
        products = Producto.objects.filter(categoria=category)

        # Serialize products as JSON
        product_data = serializers.serialize('json', products)

        product_list = json.loads(product_data)

        transformed_products = [{'id': item['pk'], **item['fields']} for item in product_list]

        # Return JSON response with the transformed data
        return JsonResponse(transformed_products, safe=False)

    except Categoria.DoesNotExist:
        # Handle the case where the category with the specified ID does not exist
        return JsonResponse({'error': 'Category does not exist'}, status=404)
    
def CategoryDetailView(request):
    # Get the 'category_id' parameter from the query string
    category_id = request.GET.get('id')

    try:
        # Retrieve the category object based on the 'category_id'
        category = Categoria.objects.get(id=category_id)

        # Serialize the category as a JSON object
        category_data = {
            'id': category.id,
            'nombre': category.nombre,
            # Add other relevant fields from the Category model here
        }

        # Return JSON response with the category data
        return JsonResponse(category_data)

    except Categoria.DoesNotExist:
        # Handle the case where the category with the specified ID does not exist
        return JsonResponse({'error': 'Category does not exist'}, status=404)
    
@require_http_methods(["GET"])
def ProductosConColoresView(request):
    # Query all products with their associated color information
    products = Producto.objects.all()

    # Create a list to store the product data
    product_list = []

    for product in products:
        # Get the unique colors associated with the product
        unique_colors = set()
        colors = ProductoColorTamaño.objects.filter(producto=product).values('color__nombre', 'color__rgb_value')

        for color in colors:
            unique_colors.add((color['color__nombre'], color['color__rgb_value']))

        # Create a dictionary for each product
        product_data = {
            'id': product.id,
            'nombre': product.nombre,
            'precio': product.precio,
            'img': str(product.img),
            'categoria': str(product.categoria),
            'grupo': str(product.grupo_id),
            'colores': [{'nombre': color[0], 'rgb_value': color[1]} for color in unique_colors],
            'destacado': product.destacado,
        }

        # Add the product dictionary to the list
        product_list.append(product_data)

    # Return the JSON response
    return JsonResponse(product_list, safe=False)

@require_http_methods(["GET"])
def ProductoDetalleView(request, producto_id=None):
    # If the product ID is provided in the URL, retrieve related objects
    if producto_id is not None:
        try:
            # Filter objects based on the provided product ID
            product_color_sizes = ProductoColorTamaño.objects.filter(producto_id=producto_id)
        except ProductoColorTamaño.DoesNotExist:
            return JsonResponse({'error': "Objetos no encontrados para el producto especificado"}, status=404)

        # Create a list to store the object data
        object_list = []

        for obj in product_color_sizes:
            # Create a dictionary for each object
            object_data = {
                'id': obj.id,
                'color': obj.color.nombre,
                'rgb': obj.color.rgb_value,
                'tamaño': obj.tamaño.nombre,
                'stock': obj.stock
            }

            # Add the object dictionary to the list
            object_list.append(object_data)

        # Return the JSON response for the list of objects
        return JsonResponse(object_list, safe=False)

    # If no product ID is provided, return an empty JSON response
    else:
        return JsonResponse([], safe=False)
    
def ImagenesProductoView(request, product_id):
    # Get the product ID from the query parameters
    product = get_object_or_404(Producto, id=product_id)

    # Retrieve all images related to the product
    product_images = ImagenesProducto.objects.filter(producto=product)

    # Create a list of dictionaries to represent the data
    images_list = [{'image_url': image.img.url, 'color': image.color.nombre} for image in product_images]

    # Return the data as JSON response
    return JsonResponse(images_list, safe=False)

@require_POST
@csrf_exempt
def CrearOrdenView(request):
    try:
        order_data = json.loads(request.body)

        # Assuming you have an OrdenSerializer defined
        serializer = OrdenSerializer(data=order_data)
        if serializer.is_valid():
            # Save the order
            orden = serializer.save()

            # Only send email if medio is 'transferencia'
            if orden.medio == 'transferencia':
                email_subject = f'Orden de compra n.º{orden.id} realizada con éxito.'

                # Render HTML email template with product data
                email_message = render_to_string('email_transferencia.html', {
                    'orden_id': orden.id,
                    'productos': orden.productos,
                    'preciototal': orden.preciototal,
                    'precioproductos': orden.precioproductos,
                    'precioenvio': orden.precioenvio,
                    'datoscliente': orden.datoscliente,
                    'medioenvio': orden.medioenvio,
                })

                # Send email with HTML content
                email_to = [orden.datoscliente.get('email', 'fallback_email@example.com'), 'agustinmar7inez@gmail.com']
                send_mail(email_subject, '', 'brosrqtaindumentaria@gmail.com', email_to, html_message=email_message)

            # Return the order details as JSON response
            orden_data = {
                'id': orden.id,
                'datoscliente': orden.datoscliente,
                'productos': orden.productos,
                'fecha': orden.fecha.isoformat(),
                'estado': orden.estado,
                'medio': orden.medio,
                'preciototal': orden.preciototal,
                'precioproductos': orden.precioproductos,
                'precioenvio': orden.precioenvio,
                'medioenvio': orden.medioenvio,
                'idtransferencia': orden.idtransferencia,
            }

            return JsonResponse(orden_data)
        else:
            # If the provided data is not valid, return an error response
            return JsonResponse({'error': 'Invalid order data'}, status=400)

    except json.JSONDecodeError:
        # Handle JSON decoding error
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)

class ModificarEstadoView(generics.UpdateAPIView):
    queryset = Orden.objects.all()
    serializer_class = OrdenSerializer
    lookup_field = 'id'

def ObtenerOrdenView(request):
    # Get the 'id' parameter from the query string
    order_id = request.GET.get('id')

    try:
        # Retrieve the order object based on the 'order_id'
        orden = get_object_or_404(Orden, id=order_id)

        # Serialize the order as a JSON object
        orden_data = {
            'id': orden.id,
            'datoscliente': orden.datoscliente,
            'productos': orden.productos,
            'fecha': orden.fecha.isoformat(),
            'estado': orden.estado,
            'medio': orden.medio,
            'preciototal': orden.preciototal,
            'precioproductos': orden.precioproductos,
            'precioenvio': orden.precioenvio,
            'medioenvio': orden.medioenvio,
            'idtransferencia': orden.idtransferencia,
        }

        # Return JSON response with the order data
        return JsonResponse(orden_data)

    except json.JSONDecodeError:
        # Handle JSON decoding error
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Orden.DoesNotExist:
        # Handle the case where the order with the specified ID does not exist
        return JsonResponse({'error': 'Order does not exist'}, status=404)
    
@require_POST
@csrf_exempt
def ActualizarEstadoUalaView(request):
    try:
        # Load JSON data from the request body
        data = json.loads(request.body)

        # Extract relevant information from the JSON data
        uuid = data.get("uuid")
        status = data.get("status")

        # Map status to corresponding 'estado' values
        estado_mapping = {
            "APPROVED": "realizada",
            "PROCESSED": "procesada",
            "REJECTED": "cancelada",
        }

        # Fetch the order with idtransferencia = uuid
        try:
            order = Orden.objects.get(idtransferencia=uuid)
        except Orden.DoesNotExist:
            return JsonResponse({'error': 'Order not found for the given UUID'}, status=404)

        # Update the 'estado' field based on the status
        new_estado = estado_mapping.get(status)
        if new_estado is not None:
            order.estado = new_estado
            order.save()
            return JsonResponse({'success': 'Order status updated successfully'})
        else:
            return JsonResponse({'error': 'Invalid status value'}, status=400)

    except json.JSONDecodeError:
        # Handle JSON decoding error
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    
@csrf_exempt
def ActualizarEstadoView(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request
            data = json.loads(request.body)

            # Extract relevant information from the JSON data
            uuid = data.get("uuid")
            status = data.get("status")

            # Map status to corresponding 'estado' values
            estado_mapping = {
                "APPROVED": "realizada",
                "PROCESSED": "procesada",
                "REJECTED": "cancelada",
            }

            # Fetch the order with idtransferencia = uuid
            try:
                order = Orden.objects.get(idtransferencia=uuid)
            except Orden.DoesNotExist:
                return JsonResponse({'error': 'Order not found for the given UUID'}, status=404)

            # Update the 'estado' field based on the status
            new_estado = estado_mapping.get(status)
            if new_estado is not None:
                # Update order estado
                order.estado = new_estado
                order.save()

                # If the status is 'realizada' or 'procesada', update stock
                if new_estado in ['realizada', 'procesada']:
                    for product_info in order.productos:
                        producto_id = product_info.get('id')
                        cantidad = product_info.get('quantity')
                        # Find the ProductoColorTamaño object and update stock
                        try:
                            product_color_size = ProductoColorTamaño.objects.get(producto_id=producto_id)
                            product_color_size.stock -= cantidad
                            product_color_size.save()
                        except ProductoColorTamaño.DoesNotExist:
                            # Handle if product not found
                            pass

                    # Send email to the customer
                    email_subject = f'Tu compra fue realizada con éxito - Orden n.º{order.id}'
                    email_message = render_to_string('email_uala.html', {
                        'orden_id': order.id,
                        'productos': order.productos,
                        'preciototal': order.preciototal,
                        'precioproductos': order.precioproductos,
                        'precioenvio': order.precioenvio,
                        'datoscliente': order.datoscliente,
                        'medioenvio': order.medioenvio,
                    })
                    email_to = [order.datoscliente.get('email', 'fallback_email@example.com'), 'agustinmar7inez@gmail.com']
                    send_mail(email_subject, '', 'brosrqtaindumentaria@gmail.com', email_to, html_message=email_message)

                return JsonResponse({'success': 'Order status updated successfully'})
            else:
                return JsonResponse({'error': 'Invalid status value'}, status=400)

        except json.JSONDecodeError:
            # Handle JSON decoding error
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)