define({ "api": [
  {
    "type": "put",
    "url": "/comments",
    "title": "Add comment",
    "group": "Comments",
    "name": "AddComment",
    "version": "1.0.0",
    "description": "<p>Adds a comment to the recall identified by <code>recallnumber</code>.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "recallnumber",
            "description": "<p>The recall number.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the commenter.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "location",
            "description": "<p>The location of the user.</p> <p>If <code>location</code> is not provided, the user's current session's state preference is used.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comment",
            "description": "<p>The comment.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "created",
            "description": "<p>The date/time when the comment was created as UNIX timestamp.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the commenter.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "location",
            "description": "<p>The location of the user.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comment",
            "description": "<p>The comment.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"created\": 123456789,\n  \"name\": \"Vizzini\",\n  \"location\": \"IL\",\n  \"comment\": \"Inconceivable.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Failure": [
          {
            "group": "FailureHeader",
            "optional": false,
            "field": "InvalidArgumentError",
            "description": "<p><code>recallnumber</code>, <code>location</code> or <code>comment</code> was not provided or was invalid. They must be strings.</p> <p><code>location</code> is invalid. It must be a string and a valid US state abbreviation.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "InvalidArgumentError",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"error\": {\n    \"code\": \"INVALID_ARGUMENT\",\n    \"message\": \"...\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api.js",
    "groupTitle": "Comments"
  },
  {
    "type": "get",
    "url": "/counts/recalls",
    "title": "Count Distinct Recall Values",
    "group": "Counts",
    "name": "CountDistinctRecallValues",
    "version": "1.0.0",
    "description": "<p>Gets count information for distinct values in a recall field.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "field",
            "description": "<p>The field for which to get count information.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "state",
            "description": "<p>The affected state.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "allowedValues": [
              "\"Ongoing\"",
              "\"Completed\"",
              "\"Terminated\"",
              "\"Pending\""
            ],
            "optional": true,
            "field": "status",
            "description": "<p>The recall status.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "total",
            "description": "<p>Total recall count.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "counts",
            "description": "<p>The counts of unique values.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "counts.term",
            "description": "<p>The count of a specific value.</p> <p>There will be a <code>term</code> key for every distinct value.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"total\": 3416,\n  \"counts\": {\n    \"Class I\": 1518,\n    \"Class II\": 1816,\n    \"Class III\": 82\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Failure": [
          {
            "group": "FailureHeader",
            "optional": false,
            "field": "ResourceNotFoundError",
            "description": "<p>There are no recalls associated with provided parameters.</p> "
          },
          {
            "group": "FailureHeader",
            "optional": false,
            "field": "InvalidArgumentError",
            "description": "<p><code>field</code> is invalid. It must be a supported count field.</p> <p><code>state</code> is invalid. It must be a valid US state abbreviation, including <code>&quot;DC&quot;</code>.</p> <p><code>status</code> is invalid. It must be one of the valid values.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "ResourceNotFoundError",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": {\n    \"code\": \"NOT_FOUND\",\n    \"message\": \"...\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "InvalidArgumentError",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"error\": {\n    \"code\": \"INVALID_ARGUMENT\",\n    \"message\": \"...\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api.js",
    "groupTitle": "Counts"
  },
  {
    "type": "get",
    "url": "/recalls/:recallid",
    "title": "Get Recall",
    "group": "Recalls",
    "name": "GetRecall",
    "version": "1.0.0",
    "description": "<p>Gets the recall identified by <code>recallid</code>.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "recallid",
            "description": "<p>The recall ID.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "recall_number",
            "description": "<p>The recall number.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "reason_for_recall",
            "description": "<p>The reason for the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>The status.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "distribution_pattern",
            "description": "<p>The distribution pattern of the recalled product.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "product_quantity",
            "description": "<p>The number of products recalled.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "recall_initiation_date",
            "description": "<p>The date/time when the recall was initiated as a UNIX timestamp.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "state",
            "description": "<p>The state for the contact of the distribution firm.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "event_id",
            "description": "<p>The ID of the recall event that includes this recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "product_type",
            "description": "<p>The type of product recalled.</p> <p>The value of this field is always <code>&quot;Food&quot;</code>.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "product_description",
            "description": "<p>The description of the recalled product.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "country",
            "description": "<p>The country for the contact of the distribution firm.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "city",
            "description": "<p>The city for the contact of the distribution firm.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "recalling_firm",
            "description": "<p>The recalling firm.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "report_date",
            "description": "<p>The date/time when the recall was reported.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "voluntary_mandated",
            "description": "<p>Explanation of whether the recall was voluntary or mandatory.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "mandated",
            "description": "<p>Indicates whether the recall was mandatory.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "classification",
            "description": "<p>The classification of the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "code_info",
            "description": "<p>The descriptive markings of the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "initial_firm_notification",
            "description": "<p>The initial method of notification from the recalling firm for the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>A unique ID that identifies the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "classificationlevel",
            "description": "<p>The <code>classification</code> expressed as a numerical level.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String[]</p> ",
            "optional": false,
            "field": "affectedstates",
            "description": "<p>The <code>distribution_pattern</code> expressed as an array of state abbreviations.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "affectednationally",
            "description": "<p>Indicates whether <code>distribution_pattern</code> indicates national distribution.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String[]</p> ",
            "optional": false,
            "field": "categories",
            "description": "<p>An array of categories into which this recall may fall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "openfda_id",
            "description": "<p>The <code>@id</code> from the OpenFDA API.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "comments",
            "description": "<p>An array of comments that have been made on this recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "comments.created",
            "description": "<p>The date/time when the comment was created as UNIX timestamp.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comments.name",
            "description": "<p>The name of the commenter.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comments.location",
            "description": "<p>The location of the user.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comments.comment",
            "description": "<p>The comment.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"recall_number\": \"F-123-4567\",\n  \"reason_for_recall\": \"There were peanuts in the apples.\",\n  \"status\": \"Ongoing\",\n  \"distribution_pattern\": \"AK only.\",\n  \"product_quantity\": \"2\",\n  \"recall_initiation_date\": 1347235200,\n  \"state\": \"AK\",\n  \"event_id\": 46798,\n  \"product_type\": \"Food\",\n  \"product_description\": \"Very shiny apples.\",\n  \"country\": \"US\",\n  \"city\": \"Anchorage\",\n  \"recalling_firm\": \"Far-North Apple Distributor\",\n  \"report_date\": 1351036800,\n  \"voluntary_mandated\": \"Voluntary: Firm Initiated\",\n  \"classification\": \"Class III\",\n  \"code_info\": \"All apples with peanuts sticking out of them.\",\n  \"initial_firm_notification\": \"E-Mail\",\n  \"id\": \"Ri0wMjgzLTIwMTMLNjMxNTkLMjAxMjA5MTALenVjY2hpbmkrcG91bmRz\",\n  \"classificationlevel\": 3,\n  \"mandated\": false,\n  \"affectedstates\": [\n    \"AK\"\n  ],\n  \"affectednationally\": false,\n  \"categories\": [\n    \"fruit\"\n  ],\n  \"openfda_id\": \"00028a950de0ef32fc01dc3963e6fdae7073912c0083faf0a1d1bcdf7a03c44c\",\n  \"comments\": [{\n    \"created\": 1435191493,\n    \"name\": \"Granny Smith\",\n    \"location\": \"AK\",\n    \"comment\": \"I was wondering why my apples were super crunchy!\"\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Failure": [
          {
            "group": "FailureHeader",
            "optional": false,
            "field": "ResourceNotFoundError",
            "description": "<p>There is no recall identified by <code>recallid</code>.</p> "
          },
          {
            "group": "FailureHeader",
            "optional": false,
            "field": "InvalidArgumentError",
            "description": "<p><code>id</code> is invalid.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "ResourceNotFoundError",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": {\n    \"code\": \"NOT_FOUND\",\n    \"message\": \"...\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "InvalidArgumentError",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"error\": {\n    \"code\": \"INVALID_ARGUMENT\",\n    \"message\": \"...\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api.js",
    "groupTitle": "Recalls"
  },
  {
    "type": "get",
    "url": "/recalls/categories",
    "title": "Get Recall Categories",
    "group": "Recalls",
    "name": "GetRecallCategories",
    "version": "1.0.0",
    "description": "<p>Gets the recall categories.</p> ",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "SuccessHeader",
            "type": "<p>String[]</p> ",
            "optional": false,
            "field": "--",
            "description": "<p>The recall categories.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "HTTP/1.1 200 OK\n[\n  \"fruit\",\n  \"fish\"\n]",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api.js",
    "groupTitle": "Recalls"
  },
  {
    "type": "get",
    "url": "/recalls",
    "title": "Get Recalls",
    "group": "Recalls",
    "name": "GetRecalls",
    "version": "1.0.0",
    "description": "<p>Gets recalls matching the provided parameters.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "state",
            "description": "<p>The two-letter abbreviation of the state affected by the recall.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": true,
            "field": "eventid",
            "description": "<p>The event ID.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "firmname",
            "description": "<p>The recalling firm's name.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": true,
            "field": "from",
            "description": "<p>A date/time that the <code>recall_initiation_date</code> must be after, as a UNIX timestamp.</p> <p>When <code>from</code> is provided, <code>to</code> must be provided.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": true,
            "field": "to",
            "description": "<p>A date/time that the <code>recall_initiation_date</code> must be before, as a UNIX timestamp.</p> <p>When <code>to</code> is provided, <code>from</code> must be provided.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "classificationlevels",
            "description": "<p>A comma-delimited list of one or more classification levels.</p> <p>Allowed values: <code>1</code>, <code>2</code>, <code>3</code>.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "keywords",
            "description": "<p>A comma-delimited list of one or more keywords.</p> <p>Allowed values: <code>&quot;dairy&quot;</code>, <code>&quot;dye&quot;</code>, <code>&quot;egg&quot;</code>, <code>&quot;fish&quot;</code>, <code>&quot;fruit&quot;</code>, <code>&quot;gluten&quot;</code>, <code>&quot;meat&quot;</code>, <code>&quot;nut&quot;</code>, <code>&quot;soy&quot;</code>, <code>&quot;spice&quot;</code>, <code>&quot;supplement&quot;</code>, <code>&quot;vegetable&quot;</code></p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "size": "0..5000",
            "optional": true,
            "field": "skip",
            "defaultValue": "0",
            "description": "<p>How many records to skip in the results.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "size": "1..100",
            "optional": true,
            "field": "limit",
            "defaultValue": "100",
            "description": "<p>The maximum number of results to return.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "skip",
            "description": "<p>The value of the <code>skip</code> input parameter.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "limit",
            "description": "<p>The value of the <code>limit</code> input parameter.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "total",
            "description": "<p>The total number of records matchin the parameters.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "data",
            "description": "<p>An array of response data objects.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.recall_number",
            "description": "<p>The recall number.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.reason_for_recall",
            "description": "<p>The reason for the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.status",
            "description": "<p>The status.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.distribution_pattern",
            "description": "<p>The distribution pattern of the recalled product.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.product_quantity",
            "description": "<p>The number of products recalled.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "data.recall_initiation_date",
            "description": "<p>The date/time when the recall was initiated as a UNIX timestamp.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.state",
            "description": "<p>The state for the contact of the distribution firm.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "data.event_id",
            "description": "<p>The ID of the recall event that includes this recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.product_type",
            "description": "<p>The type of product recalled.</p> <p>The value of this field is always <code>&quot;Food&quot;</code>.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.product_description",
            "description": "<p>The description of the recalled product.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.country",
            "description": "<p>The country for the contact of the distribution firm.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.city",
            "description": "<p>The city for the contact of the distribution firm.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.recalling_firm",
            "description": "<p>The recalling firm.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "data.report_date",
            "description": "<p>The date/time when the recall was reported.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.voluntary_mandated",
            "description": "<p>Explanation of whether the recall was voluntary or mandatory.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "data.mandated",
            "description": "<p>Indicates whether the recall was mandatory.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.classification",
            "description": "<p>The classification of the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.code_info",
            "description": "<p>The descriptive markings of the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.initial_firm_notification",
            "description": "<p>The initial method of notification from the recalling firm for the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>A unique ID that identifies the recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "data.classificationlevel",
            "description": "<p>The <code>classification</code> expressed as a numerical level.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String[]</p> ",
            "optional": false,
            "field": "data.affectedstates",
            "description": "<p>The <code>distribution_pattern</code> expressed as an array of state abbreviations.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "data.affectednationally",
            "description": "<p>Indicates whether <code>distribution_pattern</code> indicates national distribution.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String[]</p> ",
            "optional": false,
            "field": "data.categories",
            "description": "<p>An array of categories into which this recall may fall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.openfda_id",
            "description": "<p>The <code>@id</code> from the OpenFDA API.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "data.comments",
            "description": "<p>An array of comments that have been made on this recall.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "data.comments.created",
            "description": "<p>The date/time when the comment was created as UNIX timestamp.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.comments.name",
            "description": "<p>The name of the commenter.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.comments.location",
            "description": "<p>The location of the user.</p> "
          },
          {
            "group": "SuccessHeader",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "data.comments.comment",
            "description": "<p>The comment.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"skip\": 0,\n  \"limit\": 100,\n  \"total\": 1,\n  \"data\": [{\n    \"recall_number\": \"F-123-4567\",\n    \"reason_for_recall\": \"There were peanuts in the apples.\",\n    \"status\": \"Ongoing\",\n    \"distribution_pattern\": \"AK only.\",\n    \"product_quantity\": \"2\",\n    \"recall_initiation_date\": 1347235200,\n    \"state\": \"AK\",\n    \"event_id\": 46798,\n    \"product_type\": \"Food\",\n    \"product_description\": \"Very shiny apples.\",\n    \"country\": \"US\",\n    \"city\": \"Anchorage\",\n    \"recalling_firm\": \"Far-North Apple Distributor\",\n    \"report_date\": 1351036800,\n    \"voluntary_mandated\": \"Voluntary: Firm Initiated\",\n    \"classification\": \"Class III\",\n    \"code_info\": \"All apples with peanuts sticking out of them.\",\n    \"initial_firm_notification\": \"E-Mail\",\n    \"id\": \"Ri0wMjgzLTIwMTMLNjMxNTkLMjAxMjA5MTALenVjY2hpbmkrcG91bmRz\",\n    \"classificationlevel\": 3,\n    \"mandated\": false,\n    \"affectedstates\": [\n      \"AK\"\n    ],\n    \"affectednationally\": false,\n    \"categories\": [\n      \"fruit\"\n    ],\n    \"openfda_id\": \"00028a950de0ef32fc01dc3963e6fdae7073912c0083faf0a1d1bcdf7a03c44c\",\n    \"comments\": [{\n      \"created\": 1435191493,\n      \"name\": \"Granny Smith\",\n      \"location\": \"AK\",\n      \"comment\": \"I was wondering why my apples were super crunchy!\"\n    }]\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Failure": [
          {
            "group": "FailureHeader",
            "optional": false,
            "field": "ResourceNotFoundError",
            "description": "<p>There are no recalls matching the provided parameters.</p> "
          },
          {
            "group": "FailureHeader",
            "optional": false,
            "field": "InvalidArgumentError",
            "description": "<p><code>state</code> is invalid. It must be a valid US state abbreviation, including <code>&quot;DC&quot;</code>.</p> <p><code>eventid</code> is invalid. It must be an integer.</p> <p><code>from</code> is invalid. It must be a valid UNIX timestamp.</p> <p><code>to</code> is invalid. It must be a valid UNIX timestamp.</p> <p><code>from</code> and <code>to</code> are invalid. <code>from</code> must be before <code>to</code>, and if one is provided, both must be.</p> <p><code>classificationlevels</code> is invalid. It/they must be one of the valid values.</p> <p><code>keywords</code> is invalid. It/they must be one of the valid values.</p> <p><code>skip</code> or <code>limit</code> are invalid. They must integers in their respective ranges.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "ResourceNotFoundError",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": {\n    \"code\": \"NOT_FOUND\",\n    \"message\": \"...\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "InvalidArgumentError",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"error\": {\n    \"code\": \"INVALID_ARGUMENT\",\n    \"message\": \"...\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api.js",
    "groupTitle": "Recalls"
  }
] });