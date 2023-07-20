class Protocol < ApplicationRecord
  has_many :port_protocols, dependent: :destroy

  def self.tcp_id
    find_by(name: 'TCP').id
  end

  def self.udp_id
    find_by(name: 'UDP').id
  end
end
