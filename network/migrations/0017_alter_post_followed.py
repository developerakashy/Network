# Generated by Django 5.0.3 on 2024-04-13 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0016_follower'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='followed',
            field=models.TextField(max_length=25),
        ),
    ]
