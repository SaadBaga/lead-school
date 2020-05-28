function define (name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  })
}
define('saltRounds', 15)
define('token_expire', '150 days')
define('jwtSecret', 'gnvV8qLwkTrUcN8H')
define('apiJwtSecret', '7g1W9sFilXP231312s13fd131')
define('apiTokenSecret', 'nO#dLxylgpKG34sda@@$$332s')
