protocols = [
  { id: 1, name: 'TCP', description: 'Transmission Control Protocol' },
  { id: 2, name: 'UDP', description: 'User Datagram Protocol' }
]

protocols.each do |protocol|
  Protocol.find_or_create_by!(id: protocol[:id]) do |p|
    p.name = protocol[:name]
    p.description = protocol[:description]
  end
end
