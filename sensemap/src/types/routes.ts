import * as pathToRegexp from 'path-to-regexp';

export const index = '/';

export const importer = '/import';

export const mapList = '/map';

export const map = '/map/:mid';

export const toMapPath = pathToRegexp.compile(map);

export const submap = '/map/:mid/box/:bid';

export const toSubmapPath = pathToRegexp.compile(submap);

export const settings = '/settings';

export const termsOfService = '/terms-of-service';