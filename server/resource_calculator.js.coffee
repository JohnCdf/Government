class ResourceCalculator
  constructor: (@resources) ->
  canAfford: (prices) ->
    result = true
    for key, cost of prices
      break if result is false
      result = false unless @resources[key] && @resources[key] >= cost

    result

  deplete: (prices) ->
    return true if Object.keys(prices).length is 0
    return false unless @canAfford(prices)
    for key, cost of prices
      @resources[key] = @resources[key] - cost

  grant: (grants) ->
    return true if Object.keys(grants).length is 0
    for key, cost of grants
      @resources[key] = (@resources[key] || 0) + cost

  runFormulas: (formulas) ->
    for formula in formulas
      continue if not formula['enabled']
      while @canAfford(formula['cost'])
        @grant(formula['value']) if @deplete(formula['cost'])
        break unless formula['greedy']
