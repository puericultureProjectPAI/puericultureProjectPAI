CREATE TABLE forward_trading_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    children_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE timeline_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timeline_id UUID REFERENCES forward_trading_timeline(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    product_id UUID, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);