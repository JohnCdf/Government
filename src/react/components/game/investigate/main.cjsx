InvestigationView = React.createClass
  mixins: [ReactFireMixin]
  getInitialState: ->
    { id: @props.params[1], event: {} }
  componentWillMount: ->
    @bindAsObject(Global.firebaseRef.child("events/#{Global.userId}/#{@props.params[1]}"), "event")
  render: ->
    if @state.event.storyline_id is undefined
      <div className="loading_screen">
        <img src="/images/ajax.gif" /><br />
        Loading event details
      </div>
    else
      <div>
        All about this event: #{@state.event.storyline_id}
      </div>
