# Generated by Django 4.2.2 on 2023-10-19 15:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('brosback', '0009_color_fototalle_alter_producto_precio_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='producto',
            name='colores',
        ),
    ]
