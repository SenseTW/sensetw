# Utilities

## Before

```
npm install -g typescript
npm install -g ts-node
```

## `object-type-fixer.ts`

It fixes sense object types. It will be useful after Graphcool messed up them.

### Usage

```
./object-type-fixer.ts
```

## `readable-ancestors.ts`

It fetches relations between objects to a specific root object from a map, and
write those information back to boxes and cards so human can read them without
tracing edges.

### Usage

```
./readable-ancestors.ts > some.json

```

### TODO

* pass the map id as an argument
* pass the root object id as an argument
