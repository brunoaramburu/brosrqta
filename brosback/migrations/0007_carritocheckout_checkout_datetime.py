# Generated by Django 4.2.2 on 2023-08-28 14:17

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('brosback', '0006_carritocheckout'),
    ]

    operations = [
        migrations.AddField(
            model_name='carritocheckout',
            name='checkout_datetime',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
