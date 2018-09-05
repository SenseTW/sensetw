
## Architecture

```
User input --> validate -----+
                             |
     ^                       v
     |
     |               generate transaction
     |
     |                       |
                             |
   view                      v

     ^                    queued --------+
     |                                   |
     |                       |           v
                             |
 write to db <---- merge <---+        history
```

## Data types with history

* Map
  * name
  * description
  * tags
  * image
  * type
  * ownerId
  * objects
  * cards
  * boxes
  * edges
* Card
  * tags
  * mapId
  * ownerId
* Box
  * tags
  * mapId
* Object
  * mapId
  * cardId
  * boxId
  * belongsToId
* Edge
  * mapId
  * fromId
  * toId
* Tag

## Transaction data type

* createdAt
* operation
* arguments
* ownerId

## History data type

* createdAt
* ownerId
