# frozen_string_literal: true

class PortscanResult < ApplicationRecord
  belongs_to :portscan
  belongs_to :port

  alias_attribute :port_number, :port_id
end
