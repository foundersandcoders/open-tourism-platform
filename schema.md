|Users| |
|---|---|
|id| integer, Unique Key|
|username| String, Unique|
|password| String, hashed|
|email| String|
|role| String|

|Businesses| |
|---|---|
|id| integer, Unique Key|
|ownerId| integer, foreign Key|
|name| String|
|address| String|
|category| String|
|accessOptions|String|
|openingHours|String|
|description|String|
|website|String|
|phone|Integer|
|email|String|
|imageLink|String|
|lat|float|
|lng|float|

|Events| |
|---|---|
|id| integer, Unique Key|
|bizId| integer, foreign Key|
|name| String|
|location| String (default to Business)|
|category| String (default to Business)|
|accessOptions|String|
|startTime|String|
|endTime|String|
|date| Date|
|description|String |
|cost| String|
|imageLink|String (default to Business)|

|Products| |
|---|---|
|id| integer, Unique Key|
|bizId| integer, foreignKey|
|name| String|
|type| String|
|description|String |
|cost| String|
|imageLink|String (default to Business)|
|numberAvaliable| integer|
