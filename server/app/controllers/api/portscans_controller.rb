# frozen_string_literal: true

require 'socket'
require 'timeout'

module Api
  class PortscansController < ApplicationController
    def index # rubocop:disable Metrics/MethodLength
      data = Portscan.includes(:portscan_results, :ports).order(created_at: :desc).page(params[:page])
      render json: {
        data: data.map { |portscan| PortscanSerializer.new(portscan).as_json },
        pagination: {
          current_page: data.current_page,
          next_page: data.next_page,
          prev_page: data.prev_page,
          total_pages: data.total_pages,
          total_count: data.total_count
        }
      }, status: :ok
    end

    def create
      portscan_instance = Portscan.new(permitted_params)
      unless portscan_instance.valid?
        render json: { errors: portscan_instance.errors.full_messages }, status: :unprocessable_entity
        return
      end
      portscan_instance.start_scanning
      portscan_instance.save!
      render json: PortscanSerializer.new(portscan_instance).as_json, status: :created
    end

    def show
      portscan_instance = Portscan.includes(portscan_results: :port).find_by(id: params[:id])
      if portscan_instance.nil?
        render json: { errors: 'Portscan not found.' }, status: :not_found
        return
      end
      render json: PortscanSerializer.new(portscan_instance).as_json, status: :ok
    end

    private

    def permitted_params
      params.permit(:host, :port_start, :port_end, :timeout_second, :thread_count)
    end
  end
end
