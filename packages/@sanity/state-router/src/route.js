// @flow
import type {Transform, Router, RouteChildren} from './types'

import parseRoute from './parseRoute'
import resolveStateFromPath from './resolveStateFromPath'
import resolvePathFromState from './resolvePathFromState'

type NodeOptions = {
  path?: string,
  children?: RouteChildren,
  transform?: {[key: string] : Transform<*>},
  scope?: string
}

function normalizeChildren(children : any) : RouteChildren {
  if (Array.isArray(children) || typeof children === 'function') {
    return children
  }
  return children ? [children] : []
}

function isRoute(val? : NodeOptions | Router | RouteChildren) {
  return val && '_isRoute' in val
}

function normalizeArgs(
  path : string | NodeOptions,
  childrenOrOpts? : NodeOptions | Router | RouteChildren,
  children? : Router | RouteChildren
) : NodeOptions {
  if (typeof path === 'object') {
    return path
  }
  if (Array.isArray(childrenOrOpts) || typeof childrenOrOpts === 'function' || isRoute(childrenOrOpts)) {
    return {path, children: normalizeChildren(childrenOrOpts)}
  }
  if (children) {
    return {path, ...childrenOrOpts, children: normalizeChildren(children)}
  }
  return {path, ...childrenOrOpts}
}

export default function route(
  routeOrOpts : string | NodeOptions,
  childrenOrOpts? : NodeOptions | RouteChildren,
  children? : Router | RouteChildren
) : Router {
  return createNode(normalizeArgs(routeOrOpts, childrenOrOpts, children))
}

route.scope = function scope(scopeName: string, ...rest : any[]) : Router {

  const options = normalizeArgs(...rest)

  return createNode({
    ...options,
    scope: scopeName
  })
}

const EMPTY_STATE = {}
function isRoot(pathname: string): boolean {
  const parts = pathname.split('/')
  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      return false
    }
  }
  return true
}

function createNode(options : NodeOptions) : Router {
  const {path, scope, transform, children} = options
  if (!path) {
    throw new TypeError('Missing path')
  }
  const parsedRoute = parseRoute(path)

  return {
    _isRoute: true, // todo: make a Router class instead
    scope,
    route: parsedRoute,
    children: children || [],
    transform,
    encode(state) {
      return resolvePathFromState(this, state)
    },
    decode(_path) {
      return resolveStateFromPath(this, _path)
    },
    isRoot: isRoot,
    getBasePath(): boolean {
      return this.encode(EMPTY_STATE)
    },
    isNotFound(pathname: string): boolean {
      return this.decode(pathname) === null
    },
    getRedirectBase(pathname : string) : ?string {
      if (isRoot(pathname)) {
        const basePath = this.getBasePath()
        // Check if basepath is something different than given
        if (pathname !== basePath) {
          return basePath
        }
      }
      return null
    }
  }
}
