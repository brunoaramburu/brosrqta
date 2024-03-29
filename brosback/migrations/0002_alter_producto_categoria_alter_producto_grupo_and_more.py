# Generated by Django 4.2.2 on 2023-06-18 23:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('brosback', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='categoria',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='brosback.categoria'),
        ),
        migrations.AlterField(
            model_name='producto',
            name='grupo',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='brosback.grupo'),
        ),
        migrations.AlterField(
            model_name='productotamaño',
            name='stock',
            field=models.IntegerField(),
        ),
    ]
