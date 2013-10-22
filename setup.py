# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name         = 'Morgen',
    version      = '0.1',
    description  = 'A simple tool to help your JS development',
    url          = '',

    author       = 'Alberto Granzotto',
    author_email = 'a@urli.st',

    packages     = find_packages(),

    zip_safe     = False,

    entry_points = {
        'console_scripts': [
            'morgen = server:main',
        ],
    },

    install_requires = [
        'tornado',
        'watchdog',
        'docopt'
    ]
)

