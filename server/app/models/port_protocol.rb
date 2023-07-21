# frozen_string_literal: true

class PortProtocol < ApplicationRecord
  belongs_to :port
  belongs_to :protocol
end
