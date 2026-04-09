# frozen_string_literal: true

# Idempotent-ish: clears seeded tables so counts stay predictable in dev.
Redemption.delete_all
User.delete_all
Reward.delete_all

users_data = [
  ["Alice Carter", 0],
  ["Ben Okonkwo", 250],
  ["Chloe Martinez", 500],
  ["Diego Silva", 750],
  ["Elena Popov", 1200],
  ["Frank Nguyen", 1500],
]

users_data.each do |name, point_balance|
  User.create!(name: name, point_balance: point_balance)
end

# Reward photos: images.unsplash.com (Unsplash License — https://unsplash.com/license).
# Each URL is sized for thumbnails; photographers retain copyright under that license.
rewards_data = [
  [
    "Sticker pack",
    "A small set of vinyl stickers.",
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    100, 0, true,
  ],
  [
    "Coffee voucher",
    "One drink at the campus cafe.",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    50, 215, true,
  ],
  [
    "Notebook",
    "Lined A5 notebook.",
    "https://images.unsplash.com/photo-1517842645767-c639b880cd6b?w=800&q=80",
    30, 430, true,
  ],
  [
    "T-shirt",
    "Cotton crew neck, assorted sizes.",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    20, 645, true,
  ],
  [
    "USB hub",
    "4-port USB-C hub.",
    "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
    12, 860, false,
  ],
  [
    "Desk plant",
    "Low-maintenance succulent.",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    8, 1075, true,
  ],
  [
    "Headphones",
    "Closed-back wired headphones.",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    5, 1290, true,
  ],
  [
    "VIP lunch",
    "Reserved table with the team.",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    2, 1500, true,
  ],
]

rewards_data.each do |name, description, photo, stock, point_cost, active|
  Reward.create!(
    name: name,
    description: description,
    photo: photo,
    stock: stock,
    point_cost: point_cost,
    active: active,
  )
end

puts "Seeded #{User.count} users, #{Reward.count} rewards."
