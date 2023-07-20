class CreatePortProtocols < ActiveRecord::Migration[7.0]
  def change
    create_table :port_protocols do |t|
      t.references :port, null: false, foreign_key: true
      t.references :protocol, null: false, foreign_key: true

      t.timestamps
    end
  end
end
