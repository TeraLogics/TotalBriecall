### **Introduction**
This is the documentation for the settings in the Total Briecall **config.json** file. There are several conventions in use herein:
* (**default** = `value`)    
  Indicates the default value for a setting.
* (**varies**)    
  Indicates that the value of a setting will vary per installation.
* **DEPRECATED**    
  Indicates that a setting is deprecated and will be removed in the future. For settings marked as deprecated, an entry in the **Deprecation Schedule**
  will be present to indicate in what version those settings will be removed.
* (**moved** from|to `dotted.path`)
  * **to** - For deprecated settings, indicates that a new setting has taken this setting's place at `dotted.path`.
  * **from** - Indicates that this setting has taken the place of a deprecated setting at `dotted.path`.
* When a specific set of values are valid, a nested list of valid values will be provided below the setting. `true` and `false` are not explicitly listed for Boolean values.
* When a numerical value is in specific units, the units will be listed at the end of the sentence as, "...in units."

### **Deprecation Schedule**
This table indicates in what version each of these deprecated settings will be removed.

------

The remainder of this document contains each configuration setting, grouped into sections the nodes in its full dotted path. 

* `environment` - The environment. (**default** = ``"production"``)
   * `"production"` - When set to `"production"`, services will not run in debug mode and will respect their `workers` settings.
   * `"development"` - When set to `"development"`, services will...
      * ...start with one worker, regardless of their `workers` settings.
      * ...start in debug mode, with the master and worker processes' debuggers listening on the ports configured in the `debug.port` settings.

# **Connections**
* `connections.secret` - The secret to use for encryption. (**varies**)

## **MongoDB**
* `connections.mongodb.host` - The host to connect to. (**default** = `"localhost"`)
* `connections.mongodb.port` - The port to connect to. (**default** = `5432`)
* `connections.mongodb.user` - The user to connect as. (**default** = `""`)
* `connections.mongodb.database` - The database to connect to. (**default** = `""`)
* `connections.mongodb.password` - The postgres password to use. (**varies**)

# **Portal**
* `portal.version` - The version.
* `portal.host` - The hostname to listen on. (**default** = `"localhost"`)
* `portal.port` - The port to listen on. (**default** = `5000`)
* `portal.name` - The internal name of the service. (**default** = `"TOTAL-BRIECALL"`)
* `portal.workers` - The number of workers, not including the master worker process. At most, this should be one less than the number of CPUs in the system. (**default** = `3`)
* `portal.default` - The default page to which to redirect HTTP requests to "/". (**default** = `"/"`)
* `portal.sessionlength` - The session length in milliseconds. (**default** = `3600000`)

## **Logging**
* `portal.logging.title` - The title to log for each portal log entry. (**default** = `"total-briecall"`)
* `portal.logging.level` - The log level. (**default** = `"debug"`)
   * `"alert"`
   * `"critical"`
   * `"error"`
   * `"warning"`
   * `"notice"`
   * `"info"`
   * `"debug"`

## **Website**
* `portal.website.name` - The name to put in the title of the website. (**default** = `"Total Briecall"`)
* `portal.website.cookie_domain` - The domain for the Express session cookie. (**default** = `""`)
