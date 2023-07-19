# frozen_string_literal: true

require 'socket'
require 'timeout'

module Api
  class UtilController < ApplicationController
    def portscan
      portscan_instance = Portscan.new(permitted_params)
      unless portscan_instance.valid?
        render json: { errors: portscan_instance.errors.full_messages }, status: :unprocessable_entity
        return
      end
      portscan_instance.start_scanning
      portscan_instance.save!
      render json: portscan_instance.portscan_results.includes(:portscan).to_json(include: [:portscan]), status: :ok
    end

    private

    def permitted_params
      params.permit(:host, :port_start, :port_end, :timeout_second, :thread_count)
    end
  end
end
