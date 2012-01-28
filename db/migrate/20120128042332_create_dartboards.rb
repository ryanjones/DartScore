class CreateDartboards < ActiveRecord::Migration
  def change
    create_table :dartboards do |t|
      t.string :title

      t.timestamps
    end
  end
end
