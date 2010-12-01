#!/usr/bin/env python2.6
import os; activate_this=os.path.join(os.path.dirname(__file__), 'activate_this.py'); execfile(activate_this, dict(__file__=activate_this)); del os, activate_this
from django.core import management

if __name__ == "__main__":
    management.execute_from_command_line()
