# frozen_string_literal: true

class Port < ApplicationRecord
  has_many :port_protocols, dependent: :destroy
  has_many :protocols, through: :port_protocols

  alias_attribute :port_number, :id
end
