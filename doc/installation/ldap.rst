LDAP Authentication
=========================
It is possible to enable authentication via various LDAP/AD systems.

LDAP as an authentication backend in your local settings:

.. code:: python
    AUTHENTICATION_BACKENDS = (
        'django_auth_ldap.backend.LDAPBackend',
        'rules.permissions.ObjectPermissionBackend',
        'django.contrib.auth.backends.ModelBackend',
    )
    LOGGING['loggers']['django_auth_ldap'] = {
        'handlers': ['file'],
        'propagate': True,
        'level': 'DEBUG',
    }

You will need to configure the LDAP connection as well as mapping remote users
and groups to local ones. For details consult the official django-auth-ldap
documentation [http://packages.python.org/django-auth-ldap](http://packages.python.org/django-auth-ldap).
For example, connecting to an Active Directory service might look like this:

.. code:: python

    INSTALLED_APPS = [
        ...
        'django_auth_ldap'
    ]
    import ldap
    from django_auth_ldap.config import LDAPSearch, GroupOfNamesType
    AUTH_LDAP_SERVER_URI = "ldap://activedirectory.domain:389"
    AUTH_LDAP_BIND_DN = "secret"
    AUTH_LDAP_BIND_PASSWORD = "secret"
    AUTH_LDAP_PROTOCOL_VERSION = 3
    AUTH_LDAP_USER_USERNAME_ATTR = "sAMAccountName"
    AUTH_LDAP_USER_SEARCH_BASE = "DC=allegrogroup,DC=internal"
    AUTH_LDAP_USER_SEARCH_FILTER = '(&(objectClass=*)({0}=%(user)s))'.format(
    AUTH_LDAP_USER_USERNAME_ATTR)
    AUTH_LDAP_USER_SEARCH = LDAPSearch(AUTH_LDAP_USER_SEARCH_BASE,
    ldap.SCOPE_SUBTREE, AUTH_LDAP_USER_SEARCH_FILTER)
    AUTH_LDAP_USER_ATTR_MAP = {
        "first_name": "givenName",
        "last_name": "sn",
        "email": "mail"
        "company": "company",
        "manager": "manager",
        "department": "department",
        "employee_id": "employeeID",
        "location": "officeName",
        "country": "ISO-country-code",
    }


However, when using OpenDJ as a LDAP server, ``AUTH_LDAP_USER_USERNAME_ATTR`` should be equal to ``uid``:

.. code:: python
    AUTH_LDAP_USER_USERNAME_ATTR = "uid"


For other implementations objectClass may have the following values:

 * Active Directory: objectClass=user,
 * Novell eDirectory: objectClass=inetOrgPerson,
 * Open LDAP: objectClass=posixAccount

Manager is special field and is treated as reference to another user,
for example "CN=John Smith,OU=TOR,OU=Corp-Users,DC=mydomain,DC=internal"
is mapped to "John Smith" text.

Country is special field, the value of this field must be a country code in the
[ISO 3166-1 alfa-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format.


To synchronize user list you must run command:

    $ ./manage.py ldap_sync

During the process, script will report progress on every 100-th item loaded.
