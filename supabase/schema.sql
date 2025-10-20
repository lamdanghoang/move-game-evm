--- Create the rooms table
CREATE TABLE rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code text NOT NULL UNIQUE,
    game_state jsonb NOT NULL,
    status text DEFAULT 'waiting',
    max_players integer DEFAULT 4,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

--- Enable RLS for the rooms table
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

--- Create the room_players table
CREATE TABLE room_players (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id uuid REFERENCES rooms(id),
    user_id text NOT NULL,
    player_order integer NOT NULL,
    is_ready boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    UNIQUE(room_id, user_id)
);

--- Enable RLS for the room_players table
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;

--- Create the game_moves table
CREATE TABLE game_moves (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    room_id uuid REFERENCES rooms(id),
    user_id text NOT NULL,
    move_type text NOT NULL,
    move_data jsonb,
    created_at timestamptz DEFAULT now()
);

--- Enable RLS for the game_moves table
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;

--- RLS Policies
CREATE POLICY "Allow all access" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all access" ON room_players FOR ALL USING (true);
CREATE POLICY "Allow all access" ON game_moves FOR ALL USING (true);