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

rewards_data = [
  ["Sticker pack", "A small set of vinyl stickers.", 100, 0, true],
  ["Coffee voucher", "One drink at the campus cafe.", 50, 215, true],
  ["Notebook", "Lined A5 notebook.", 30, 430, true],
  ["T-shirt", "Cotton crew neck, assorted sizes.", 20, 645, true],
  ["USB hub", "4-port USB-C hub.", 12, 860, false],
  ["Desk plant", "Low-maintenance succulent.", 8, 1075, true],
  ["Headphones", "Closed-back wired headphones.", 5, 1290, true],
  ["VIP lunch", "Reserved table with the team.", 2, 1500, true],
]

rewards_data.each do |name, description, stock, point_cost, active|
  Reward.create!(
    name: name,
    description: description,
    stock: stock,
    point_cost: point_cost,
    active: active,
  )
end

puts "Seeded #{User.count} users, #{Reward.count} rewards."
