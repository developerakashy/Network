# Generated by Django 5.0.3 on 2024-04-09 13:26

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0012_rename_comment_postcomment'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]