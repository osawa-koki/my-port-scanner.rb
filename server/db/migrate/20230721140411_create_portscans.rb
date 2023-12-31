# frozen_string_literal: true

class CreatePortscans < ActiveRecord::Migration[7.0]
  def change
    create_table :portscans do |t|
      t.string :host, null: false
      t.string :ip_address, null: false
      t.integer :port_start, null: false
      t.integer :port_end, null: false
      t.integer :timeout_second, null: false, default: 1
      t.integer :thread_count, null: false, default: 10

      t.timestamps
    end
  end
end
