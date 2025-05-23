/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as FabricImport } from './routes/fabric'
import { Route as ColorPickersImport } from './routes/colorPickers'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const FabricRoute = FabricImport.update({
  id: '/fabric',
  path: '/fabric',
  getParentRoute: () => rootRoute,
} as any)

const ColorPickersRoute = ColorPickersImport.update({
  id: '/colorPickers',
  path: '/colorPickers',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/colorPickers': {
      id: '/colorPickers'
      path: '/colorPickers'
      fullPath: '/colorPickers'
      preLoaderRoute: typeof ColorPickersImport
      parentRoute: typeof rootRoute
    }
    '/fabric': {
      id: '/fabric'
      path: '/fabric'
      fullPath: '/fabric'
      preLoaderRoute: typeof FabricImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/colorPickers': typeof ColorPickersRoute
  '/fabric': typeof FabricRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/colorPickers': typeof ColorPickersRoute
  '/fabric': typeof FabricRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/colorPickers': typeof ColorPickersRoute
  '/fabric': typeof FabricRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/colorPickers' | '/fabric'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/colorPickers' | '/fabric'
  id: '__root__' | '/' | '/colorPickers' | '/fabric'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ColorPickersRoute: typeof ColorPickersRoute
  FabricRoute: typeof FabricRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ColorPickersRoute: ColorPickersRoute,
  FabricRoute: FabricRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/colorPickers",
        "/fabric"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/colorPickers": {
      "filePath": "colorPickers.tsx"
    },
    "/fabric": {
      "filePath": "fabric.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
