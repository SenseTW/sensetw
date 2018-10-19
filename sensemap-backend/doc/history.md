
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


# Data

- at when
- by who
- on map

## Card history

- create
- delete
- archive
- add to map
- add to box X
- eject from box X
- link to object X
- unlink to object X
- change
  - summary from X to Y
  - description from X to Y
  - tag from X to Y
  - stakeholders from X to Y
  - said_by from X to Y
  - source_link from X to Y
  - source_title from X to Y
  - card_type from X to Y
  -

        Edits on Card:
            Created/ archived/ deleted by {who} at {time}
            Added to the map by {who} at {time}
            {who} changed the summary {} from {} at {time}
            {who} edited the {description}/ {tag}/ {stakeholders}/ {said_by}/ {source_link}/ {source_title} at {time}
            {who} changed Card type from {} to {} at {time}
            {who} linked/unlinked this Card to {} at {time}
            Added in / ejected out of {Box title} by {who} at {time}

## Box history

- create
- delete
- link to object X
- unlink to object X
- change
  - box title from X to Y
  - tag from X to Y
  - summary from X to Y
  - boxType from X to Y
  - add card X
  - eject card X

          Edits on Box
              Created/ deleted by {who} at {time}
              {who} changed the Box Title {} from {} at {time}
              {who} edited {tag}, {summary} at {time}
              {who} changed Box type from {} to {} at {time}
              {who} linked/unlinked this Box to {} at {time}
              {who} added / ejected {Card Summary} out of a this Box at {time}

## Map history

- create
- add card X
- delete card X
- add box X
- delete box X
- change
  - description from X to Y
  - tag from X to Y
  - name from X to Y
  - card
  - box
  - add edge between object X and object Y
  - delete edge between object X and object Y

        Edits on Map
            Created by {who} at {time}
            {who} added/deleted {CARD}, {BOX}
            {who} changed Card Summary "{CARD summary}"/ Box Title "{Box title}" from "{CARD summary}"/ "{Box title}".
            {who} edited {description}/ {tag}/ {stakeholders}/ {said_by}/ {source_link}/ {source_title} in Card "{summary}" at {time}
            {who} edited {tag}, {summary} in Box "{Box title}" at {time}.
            {who} added / deleted {EDGE} between {} and {}
            {who} added/ejected Card "{summary}" into / out of Box "{title}".
            {who} edited {description}, {tag} in Map Details
            {who} changed Map Name from {} to {}

## TODO

* userId in Transaction? in transaction?
* denormalize card & box & map history
