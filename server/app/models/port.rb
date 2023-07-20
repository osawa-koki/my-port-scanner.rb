class Port < ApplicationRecord
  has_many :port_protocols, dependent: :destroy
  has_many :protocols, through: :port_protocols
end
