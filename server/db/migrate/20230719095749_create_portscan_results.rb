class CreatePortscanResults < ActiveRecord::Migration[7.0]
  def change
    create_table :portscan_results do |t|
      t.references :portscan, null: false, foreign_key: true
      t.integer :port_number, null: false
      t.boolean :open, null: false

      t.timestamps
    end
  end
end
