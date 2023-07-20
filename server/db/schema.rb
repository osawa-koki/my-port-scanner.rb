# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_07_19_095749) do
  create_table "portscan_results", force: :cascade do |t|
    t.integer "portscan_id", null: false
    t.integer "port_number", null: false
    t.boolean "open", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["portscan_id"], name: "index_portscan_results_on_portscan_id"
  end

  create_table "portscans", force: :cascade do |t|
    t.string "host", null: false
    t.string "ip_address", null: false
    t.integer "port_start", null: false
    t.integer "port_end", null: false
    t.integer "timeout_second", default: 1, null: false
    t.integer "thread_count", default: 10, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "portscan_results", "portscans"
end
