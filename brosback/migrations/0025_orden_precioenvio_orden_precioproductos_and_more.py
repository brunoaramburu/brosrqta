# Generated by Django 4.2.6 on 2024-04-06 01:39

import colorfield.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brosback', '0024_alter_orden_idtransferencia'),
    ]

    operations = [
        migrations.AddField(
            model_name='orden',
            name='precioenvio',
            field=models.CharField(default=0, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='orden',
            name='precioproductos',
            field=models.CharField(default='0', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='color',
            name='rgb_value',
            field=colorfield.fields.ColorField(default='#FF0000', image_field=None, max_length=25, samples=None),
        ),
    ]