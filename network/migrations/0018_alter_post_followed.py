# Generated by Django 5.0.3 on 2024-04-13 20:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0017_alter_post_followed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='followed',
            field=models.TextField(max_length=250),
        ),
    ]