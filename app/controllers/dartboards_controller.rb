class DartboardsController < ApplicationController
  # GET /dartboards
  # GET /dartboards.json
  def index
    @dartboards = Dartboard.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @dartboards }
    end
  end

  # GET /dartboards/1
  # GET /dartboards/1.json
  def show
    @dartboard = Dartboard.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @dartboard }
    end
  end

  # GET /dartboards/new
  # GET /dartboards/new.json
  def new
    @dartboard = Dartboard.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @dartboard }
    end
  end

  # GET /dartboards/1/edit
  def edit
    @dartboard = Dartboard.find(params[:id])
  end

  # POST /dartboards
  # POST /dartboards.json
  def create
    @dartboard = Dartboard.new(params[:dartboard])

    respond_to do |format|
      if @dartboard.save
        format.html { redirect_to @dartboard, notice: 'Dartboard was successfully created.' }
        format.json { render json: @dartboard, status: :created, location: @dartboard }
      else
        format.html { render action: "new" }
        format.json { render json: @dartboard.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /dartboards/1
  # PUT /dartboards/1.json
  def update
    @dartboard = Dartboard.find(params[:id])

    respond_to do |format|
      if @dartboard.update_attributes(params[:dartboard])
        format.html { redirect_to @dartboard, notice: 'Dartboard was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @dartboard.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dartboards/1
  # DELETE /dartboards/1.json
  def destroy
    @dartboard = Dartboard.find(params[:id])
    @dartboard.destroy

    respond_to do |format|
      format.html { redirect_to dartboards_url }
      format.json { head :no_content }
    end
  end
end
