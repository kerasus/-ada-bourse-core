import * as fengari from 'fengari-web'

const {
  lua,
  lauxlib,
  lualib,
  to_jsstring,
  to_luastring
} = fengari

// let fengari: any = {}
//
// if (typeof window !== 'undefined') {
//   fengari = await import('fengari-web')
// }
// export const lua = fengari.lua || {}
// export const lauxlib = fengari.lauxlib || {}
// export const lualib = fengari.lualib || {}
// export const to_jsstring = fengari.to_jsstring || ((x: any) => '')
// export const to_luastring = fengari.to_luastring || ((x: any) => '')

function openSafeLibs (L: any): void {
  lauxlib.luaL_requiref(L, to_luastring('base'), lualib.luaopen_base, 1)
  lauxlib.luaL_requiref(L, to_luastring('math'), lualib.luaopen_math, 1)
  lauxlib.luaL_requiref(L, to_luastring('table'), lualib.luaopen_table, 1)
  lauxlib.luaL_requiref(L, to_luastring('string'), lualib.luaopen_string, 1)
  lauxlib.luaL_requiref(L, to_luastring('utf8'), lualib.luaopen_utf8, 1)
  lua.lua_pop(L, 5)
}

function pushJSValueToLua (L: any, value: any) {
  if (typeof value === 'string') {
    lua.lua_pushstring(L, to_luastring(value))
  } else if (typeof value === 'number') {
    lua.lua_pushnumber(L, value)
  } else if (typeof value === 'boolean') {
    lua.lua_pushboolean(L, value)
  } else if (value === null || value === undefined) {
    lua.lua_pushnil(L)
  } else if (Array.isArray(value)) {
    lua.lua_newtable(L)
    value.forEach((v, i) => {
      pushJSValueToLua(L, v)
      lua.lua_rawseti(L, -2, i + 1) // Lua array indices start at 1
    })
  } else if (typeof value === 'object') {
    lua.lua_newtable(L)
    Object.entries(value).forEach(([k, v]) => {
      lua.lua_pushstring(L, to_luastring(k))
      pushJSValueToLua(L, v)
      lua.lua_settable(L, -3)
    })
  } else {
    lua.lua_pushnil(L)
  }
}

function pushParamsToLuaGlobal (L: any, params: Record<string, any>) {
  pushJSValueToLua(L, params)
  lua.lua_setglobal(L, to_luastring('__params__'))
}

// function passParamsToScript (L: any, params: Record<string, any> = {}): void {
//   lua.lua_newtable(L)
//
//   Object.entries(params).forEach(([key, value]) => {
//     lua.lua_pushstring(L, to_luastring(key))
//     pushJSValueToLua(L, value)
//     lua.lua_settable(L, -3)
//   })
//   lua.lua_setglobal(L, to_luastring('__params__'))
// }

export function runSafeLuaScript (luaCode: string, params: Record<string, any> = {}): string {
  const L = lauxlib.luaL_newstate()
  openSafeLibs(L)

  const statusLoad = lauxlib.luaL_loadstring(L, to_luastring(luaCode))
  if (statusLoad !== lua.LUA_OK) {
    const msg = to_jsstring(lua.lua_tostring(L, -1))
    throw new Error(`Lua load error: ${msg}`)
  }

  pushParamsToLuaGlobal(L, params)

  const statusCall = lua.lua_pcall(L, 0, lua.LUA_MULTRET, 0)
  if (statusCall !== lua.LUA_OK) {
    const msg = lua.lua_tojsstring(L, -1)
    // const msg = to_jsstring(lua.lua_tostring(L, -1))
    throw new Error(`Lua runtime error: ${msg}`)
  }

  if (lua.lua_gettop(L) > 0) {
    return lua.lua_tojsstring(L, -1)
    // return to_jsstring(lua.lua_tostring(L, -1))
  }

  return ''
}
