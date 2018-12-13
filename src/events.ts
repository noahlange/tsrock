enum Events {
  DISPLAY_CHAT_EVENT = 'minecraft:display_chat_event',
  EXECUTE_COMMAND = 'minecraft:execute_command',
  SPAWN_PARTICLE_ENTITY = 'minecraft:spawn_particle_attached_entity',
  SPAWN_PARTICLE_WORLD = 'minecraft:spawn_particle_in_world',
  ENTITY_CREATED = 'minecraft:entity_created',
  ENTITY_DEATH = 'minecraft:entity_death',
  ENTITY_RIDING_START = 'minecraft:entity_start_riding',
  ENTITY_RIDING_STOP = 'minecraft:entity_stop_riding',
  ENTITY_TICK = 'minecraft:entity_tick',
  ENTITY_PLAYER_ATTACK_ACTOR = 'minecraft:player_attacked_actor',
  LOAD_UI = 'minecraft:load_ui',
  UNLOAD_UI = 'minecraft:unload_ui',
  SEND_UI_EVENT = 'minecraft:send_ui_event',
  CLIENT_ENTERED_WORLD = 'minecraft:client_entered_world',
  HIT_RESULT_CHANGED = 'minecraft:hit_result_changed',
  HIT_RESULT_CONTINUOUS = 'minecraft:hit_result_continuous',
  PICK_HIT_RESULT_CHANGED = 'minecraft:pick_hit_result_changed',
  PICK_HIT_RESULT_CONTINUOUS = 'minecraft:pick_hit_result_continuous',
  UI_EVENT = 'minecraft:ui_event'
}

export default Events;
