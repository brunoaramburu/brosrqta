# Generated by Django 4.2.6 on 2024-01-28 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brosback', '0015_orden_preciototal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orden',
            name='id',
            field=models.AutoField(default=1000, primary_key=True, serialize=False),
        ),
    ]
