"""bros URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from brosback.views import create_preference, ProductoCreateAPIView, ProductoListView, ProductoDetailView, TamanoNombreView, CategoriaListView, ProductsByCategoryView, CategoryDetailView, FotoTalleView, ProductosConColoresView, ProductoDetalleView, ImagenesProductoView, CrearOrdenView, ModificarEstadoView, ObtenerOrdenView, ActualizarEstadoUalaView, AvisoListView, EnvioListView
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView

admin.site.site_header = 'BROS'                    
admin.site.index_title = 'PANEL DE ADMINISTRACIÓN'                 
admin.site.site_title = 'BROS'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/create_preference/', create_preference, name='create_preference'),
    path('api/producto/create/', ProductoCreateAPIView.as_view(), name='producto-create'),
    path('api/productos/', ProductoListView.as_view(), name='producto-list'),
    path('api/producto/<int:pk>/', ProductoDetailView.as_view(), name='producto-detail'),
    path('api/talle/<int:tamano_id>/', TamanoNombreView, name='nombre-tamano'),
    path('api/fototalle/<int:foto_talle_id>/', FotoTalleView, name='foto-talle'),
    path('api/categorias/', CategoriaListView.as_view(), name='categoria-list'),
    path('api/categoriaproductos/', ProductsByCategoryView, name='productos-categoria'),
    path('api/categoria/', CategoryDetailView, name='categoria-detail'),
    path('api/productosconcolores/', ProductosConColoresView, name='productos-colores'),
    path('api/productosconcolores/<int:producto_id>/', ProductosConColoresView, name='producto-colores'),
    path('api/producto/<int:producto_id>/detalle/', ProductoDetalleView, name='detalle_producto'),
    path('api/imagenesproducto/<int:product_id>/', ImagenesProductoView, name='imagenes-producto'),
    path('api/crearorden/', CrearOrdenView, name='create_orden_api'),
    path('api/obtenerorden/', ObtenerOrdenView, name='obtener_orden_api'),
    path('api/actualizarestadouala/', ActualizarEstadoUalaView, name='actualizar_estado_uala_api'),
    path('api/modificarestado/<int:id>/', ModificarEstadoView.as_view(), name='modify_estado_api'),
    path('api/envio/', EnvioListView.as_view(), name='envio'),
    path('api/avisos/', AvisoListView.as_view(), name='avisos'),
    path('', TemplateView.as_view(template_name='index.html')),
    path('categorias/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^producto/(?P<path>.*)$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^categoria/(?P<path>.*)$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^ordentransferencia/(?P<path>.*)$', TemplateView.as_view(template_name='index.html')),





] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
