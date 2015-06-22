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

# *Environment Variables*
* `ENV` - The environment. (**default** = ``"production"``)
* `PORT` - The port to listen on. (**default** = `5000`)
* `SECRET` - The secret to use for encryption. (**varies**)
* `SESSIONLENGTH` - The session length in milliseconds. (**default** = `3600000`)

# **Connections**

## **MongoDB**
* `connections.mongodb.host` - The host to connect to. (**default** = `"localhost"`)
* `connections.mongodb.port` - The port to connect to. (**default** = `5432`)
* `connections.mongodb.user` - The user to connect as. (**default** = `""`)
* `connections.mongodb.database` - The database to connect to. (**default** = `""`)
* `connections.mongodb.password` - The postgres password to use. (**varies**)