class CreatePorts < ActiveRecord::Migration[7.0]
  def change
    create_table :ports do |t|
      t.string :service
      t.string :description
      t.integer :severity

      t.timestamps
    end
  end
end
